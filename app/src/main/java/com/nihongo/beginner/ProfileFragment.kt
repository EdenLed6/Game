package com.nihongo.beginner

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.Fragment
import com.nihongo.beginner.data.ProgressManager
import com.nihongo.beginner.databinding.FragmentProfileBinding

class ProfileFragment : Fragment() {
    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!

    private val prefs get() = requireContext().getSharedPreferences("nihongo_profile", 0)

    private val pickImage = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val uri = result.data?.data ?: return@registerForActivityResult
            requireContext().contentResolver.takePersistableUriPermission(
                uri, Intent.FLAG_GRANT_READ_URI_PERMISSION
            )
            prefs.edit().putString("photo_uri", uri.toString()).apply()
            loadPhoto(uri)
        }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.btnEditPhoto.setOnClickListener { launchImagePicker() }
        binding.btnEditName.setOnClickListener { showEditNameDialog() }

        binding.btnResetProgress.setOnClickListener {
            AlertDialog.Builder(requireContext())
                .setTitle("איפוס התקדמות")
                .setMessage("האם לאפס את כל ההתקדמות שלך? פעולה זו אינה ניתנת לביטול.")
                .setPositiveButton("אפס") { _, _ ->
                    ProgressManager.resetProgress(requireContext())
                    refresh()
                }
                .setNegativeButton("ביטול", null)
                .show()
        }

        loadProfile()
        refresh()
    }

    override fun onResume() {
        super.onResume()
        refresh()
    }

    private fun loadProfile() {
        val name = prefs.getString("profile_name", "הלומד שלי") ?: "הלומד שלי"
        binding.tvProfileName.text = name
        updateInitial(name)

        val uriStr = prefs.getString("photo_uri", null)
        if (uriStr != null) {
            loadPhoto(Uri.parse(uriStr))
        }
    }

    private fun updateInitial(name: String) {
        binding.tvAvatarInitial.text = name.firstOrNull { it.isLetter() }?.uppercaseChar()?.toString() ?: "?"
    }

    private fun loadPhoto(uri: Uri) {
        try {
            binding.ivAvatar.setImageURI(uri)
            binding.tvAvatarInitial.visibility = View.GONE
        } catch (e: Exception) {
            binding.tvAvatarInitial.visibility = View.VISIBLE
        }
    }

    private fun launchImagePicker() {
        val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "image/*"
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION)
        }
        pickImage.launch(intent)
    }

    private fun showEditNameDialog() {
        val current = prefs.getString("profile_name", "הלומד שלי") ?: "הלומד שלי"
        val input = EditText(requireContext()).apply {
            setText(current)
            setSelection(current.length)
        }
        AlertDialog.Builder(requireContext())
            .setTitle("עריכת שם")
            .setView(input)
            .setPositiveButton("שמור") { _, _ ->
                val newName = input.text.toString().trim().ifEmpty { "הלומד שלי" }
                prefs.edit().putString("profile_name", newName).apply()
                binding.tvProfileName.text = newName
                updateInitial(newName)
            }
            .setNegativeButton("ביטול", null)
            .show()
    }

    private fun refresh() {
        val ctx = requireContext()
        val completed = ProgressManager.getCompletedCount(ctx)
        val total = ProgressManager.getTotalLessons()
        val xp = ProgressManager.getTotalXP(ctx)
        val streak = ProgressManager.getStreak(ctx)
        val percent = (completed * 100) / total

        binding.tvStatStreak.text = streak.toString()
        binding.tvStatXP.text = xp.toString()
        binding.tvStatLessons.text = "$completed/$total"
        binding.tvProgressPercent.text = "$percent%"
        binding.progressCourse.progress = percent
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
